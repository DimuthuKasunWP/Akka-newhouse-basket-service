export default ({ name, ports, domain }) => ({
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    name: name
  },
  spec: {
    ports: ports.map(port => ({ name: port.name.toLowerCase(), targetPort: port.port, port: port.port })),
    selector: {
      domain,
      task: name
    }
  }
});
