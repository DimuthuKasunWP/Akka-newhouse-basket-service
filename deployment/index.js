import yaml from 'js-yaml';
import fs from 'fs';
import deployment from './deployment';
import service from './service';
import ingress from './ingress';
import readJsonFile from './readJsonFile';

// ** Get some env. vars from build
const name = process.env.REPOSITORYNAME || '';
const version = process.env.SERVICE_VERSION || '';
const environment = process.env.ENVIRONMENT || '';
const dockerImage = process.env.DOCKER_SERVICE_IMAGE || '';

async function getConfiguration() {
  return await readJsonFile('../platformsettings.json');
}

const settingsPromise = getConfiguration().then((config) => {
  const ports = Object.keys(config.Platform.Ports).map(name => ({ name, port: config.Platform.Ports[name] }));
  if (!Object.keys(config.Environments).some(name => name.toLowerCase() === environment.toLowerCase())) {
    throw new Error(`Could not environment '${environment}' in platformsettings.json!`);
  }

  const environmentSettings = config.Environments[Object.keys(config.Environments)
    .filter(name => name.toLowerCase() === environment.toLowerCase())[0]];

  const ingressAnnotations = {
    ['kubernetes.io/ingress.class']: 'traefik',
    ['traefik.frontend.rule.type']: 'PathPrefixStrip'
  };

  const env = Object.keys(environmentSettings.Vars).map(name => ({ name, value: environmentSettings.Vars[name] }));
  const deploymentObject = deployment({
    name,
    namespace: config.Platform.Namespace,
    domain: config.Platform.FunctionalDomain,
    ports,
    healthCheckPath: config.Platform.HealthCheckPath,
    replicas: environmentSettings.NoInstances,
    version,
    dockerImage,
    cpu: environmentSettings.Cpu,
    memory: environmentSettings.Memory,
    env
  });

  const deploymentYaml = yaml.safeDump(deploymentObject, { skipInvalid: false });
  fs.writeFile('deployment.yaml', deploymentYaml, (err) => {
    if (err) return console.log(err);
    console.log('Written deployment.yaml');
  });

  const serviceObject = service({
    name,
    domain: config.Platform.FunctionalDomain,
    ports
  });

  const serviceYaml = yaml.safeDump(serviceObject, { skipInvalid: false });
  fs.writeFile('service.yaml', serviceYaml, (err) => {
    if (err) return console.log(err);
    console.log('Written service.yaml');
  });

  const ingressObject = ingress({
    name,
    namespace: config.Platform.Namespace,
    hostName: config.Platform.LoadbalancerHostName,
    path: config.Platform.LoadbalancerPrefixPath,
    domain: config.Platform.FunctionalDomain,
    port: ports.filter(p => p.name.toLowerCase() === 'http')[0].port,
    annotations: ingressAnnotations
  });

  const ingressYaml = yaml.safeDump(ingressObject, { skipInvalid: false });
  fs.writeFile('ingress.yaml', ingressYaml, (err) => {
    if (err) return console.log(err);
    console.log('Written ingress.yaml');
  });
});






