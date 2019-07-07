
export default ({ name, namespace, hostName, path, port, annotations }) => ({
  apiVersion: 'extensions/v1beta1',
  kind: 'Ingress',
  metadata: {
    name,
    namespace,
    annotations
  },
  spec: {
    rules: [
      {
        host: hostName,
        http: {
          paths: [
            {
              path,
              backend: {
                serviceName: name,
                servicePort: port
              }
            }
          ]
        }
      }
    ]
  }
});
