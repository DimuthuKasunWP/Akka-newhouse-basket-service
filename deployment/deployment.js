export default ({ name, domain, replicas, version, dockerImage, cpu, memory, ports, env, healthCheckPath }) => ({
  kind: 'Deployment',
  apiVersion: 'extensions/v1beta1',
  metadata: {
    name,
    labels: { domain }
  },
  spec: {
    replicas,
    strategy: {
      type: 'RollingUpdate',
      rollingUpdate: {
        maxSurge: 1,
        maxUnavailable: 1
      }
    },
    revisionHistoryLimit: 2,
    selector: {
      matchLabels: { domain, task: name }
    },
    template: {
      metadata: {
        labels: { domain, task: name, version }
      },
      spec: {
        containers: [
          {
            name,
            image: dockerImage,
            resources: {
              requests: { cpu, memory },
              limits: { cpu, memory }
            },
            ports: ports.map(port => ({ containerPort: port.port })),
            readinessProbe: {
              httpGet: {
                path: healthCheckPath,
                port: ports.filter(port => port.name.toLowerCase() == 'http')[0].port,
              },
              initialDelaySeconds: 5,
              periodSeconds: 3,
              timeoutSeconds: 2,
              successThreshold: 1,
              failureThreshold: 3
            },
            env
          }
        ]
      }
    }
  }
});
