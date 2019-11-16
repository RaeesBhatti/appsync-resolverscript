# appsync-resolverscript

Typed JavaScript abstraction for AWS AppSync resolver templates.

[![Build Status](https://travis-ci.org/alexmcmanus/appsync-resolverscript.svg?branch=master)](https://travis-ci.org/alexmcmanus/appsync-resolverscript)
[![codecov](https://codecov.io/gh/alexmcmanus/appsync-resolverscript/branch/master/graph/badge.svg)](https://codecov.io/gh/alexmcmanus/appsync-resolverscript)

```js
import * as assert from 'assert'
import { sendRequest, vtl } from 'appsync-resolverscript'

const templateBuilder = sendRequest({
  operation: 'GetItem',
  version: '2017-02-28',
  key: {
    id: vtl`$util.dynamodb.toDynamoDBJson($ctx.args.id)`
  }
}).then(vtl`$util.toJson($context.result)`)

assert.strictEqual(
  templateBuilder.requestTemplate,
  `{
  "operation": "GetItem",
  "version": "2017-02-28",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
  }
}`
)
assert.strictEqual(templateBuilder.responseTemplate, '$util.toJson($context.result)')
```

- Generate AWS AppSync resolver Velocity templates from JavaScript or TypeScript.
- Use type-checked JavaScript rather than VTL.
- Publish patterns as NPM packages and re-use them.
- Works with [https://aws.amazon.com/cdk/](AWS CDK) and [https://www.pulumi.com/](Pulumi).

## Installation

With Yarn:

```
$ yarn add --dev appsync-resolverscript
```

Or NPM:

```
$ npm install appsync-resolverscript --save-dev
```

## Usage

### Build Request Template

`ResolverTemplateBuilder.sendRequest(request): ResolverTemplateBuilder`

**Parameters**:

<dl>
  <dt><em>request: any</em></dt>
  <dd>
    an object or value that is JSON serialized to form the template.
    If <code>request</code> is a function, the value returned from the function is JSON-serialized.
  </dd>
</dl>

**Returns**:

<dl>
  <dt><em>ResolverTemplateBuilder</em></dt>
  <dd>
    the builder, which allows you to specify the response template promise-style in the <code>then()</code> handler.
  </dd>
</dl>

### Build Response Template

`ResolverTemplateBuilder.then(response): ResolverTemplateBuilder`

**Parameters**:

<dl>
  <dt><em>response: any</em></dt>
  <dd>
    an object or value that is JSON serialized to form the template.
    If <code>response</code> is a function, the value returned from the function is JSON-serialized.
  </dd>
</dl>

**Returns**:

<dl>
  <dt><em>ResolverTemplateBuilder</em></dt>
  <dd>
    the builder, which allows you to specify the response template promise-style in the <code>then()</code> handler.
  </dd>
</dl>

If there are multiple calls to `sendRequest()` or `then()`, the last ones take precedence.

### Template Directives

To step outside the strict JSON serialization of the template, use the `vtl` template literal - the contents
will be injected directly into the template. Alternatively, use an instance of `VelocityFragment`.

### Defaults

Both `sendRequest()` and `then()` are optional, and fall back to the following defaults:

<dl>
  <dt><em>sendRequest()</em></dt>
  <dd>
    <code>{}</code>
  </dd>
  <dt><em>then()</em></dt>
  <dd>
    <code>$util.toJson($context.result)</code>
  </dd>
</dl>

### Velocity Templates

Access the templates via the `requestTemplate` and `responseTemplate` _string_ properties.

## Pulumi

Pulumi is supported via the `PulumiResolver` class. It has the same usage as `aws.appsync.Resolver`, but the
`requestTemplate` and `responseTemplate` properties are replaced with `template: ResolverTemplateBuilder`, and
can be used as follows:

```ts
new PulumiResolver('getUserResolver', {
  apiId: horselingApi.id,
  dataSource: databaseDataSource.name,
  type: 'Query',
  field: 'getUser',
  template: sendRequest({
    version: '2017-02-28',
    operation: 'GetItem',
    key: {
      id: vtl`$util.dynamodb.toDynamoDBJson($ctx.args.id)`
    }
  }).then('$util.toJson($ctx.prev.result)')
})
```

## Roadmap

- Add ability to reference Velocity variables directly.
- Pre-populate Velocity variables for Unit and Pipeline templates.
- Add ability to set Velocity variables.
- Add ability to reference core `util` functions directly.
- Add ability to reference `dynamodb` functions directly.
- Add higher-level abstractions for DynamoDB API.
- Support `sendRequest().catch()`.
- Support `map()` and `filter()` on variables.
- Add explicit support for pipeline resolvers.
- Add explicit support for AWS CDK.
- Add examples.

## Contributions

Contributions with unit tests are welcome, but please raise an issue and get feedback before spending any
significant effort.
