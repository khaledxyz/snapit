import { defineConfig } from 'orval';

export default defineConfig({
  snapit: {
    input: '../../apps/api/openapi.json',
    output: {
      target: './src',
      client: 'fetch',
      mode: 'tags',
      override: {
        mutator: {
          path: './src/mutator.ts',
          name: 'customFetch',
        },
        operationName: (operation) => {
          // Remove "Controller" and everything before it
          // "UrlsController_createUrl" -> "createUrl"
          const operationId = typeof operation === 'string' ? operation : operation.operationId;
          
          // Handle snake_case from OpenAPI (ControllerName_methodName)
          if (operationId.includes('_')) {
            return operationId.split('_')[1];
          }
          
          // Handle camelCase (controllerNameMethodName)
          const parts = operationId.split('Controller');
          if (parts.length > 1) {
            // Lowercase first letter of the method name
            const methodName = parts[1];
            return methodName.charAt(0).toLowerCase() + methodName.slice(1);
          }
          
          return operationId;
        },
      },
    },
  },
});
