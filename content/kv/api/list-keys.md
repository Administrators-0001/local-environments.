---
pcx_content_type: concept
title: List keys
weight: 7
---

# List keys

To list all the keys in your KV namespace, call the `list()` method of the [KV binding](/kv/reference/kv-bindings/) on any [KV namespace](/kv/reference/kv-namespaces/) you have bound to your Worker code:


```js
env.NAMESPACE.list();
```

The `list()` method returns a promise you can `await` on to get the value. 

#### Example 

An example of listing keys from within a Worker:

```js
export default {
    async fetch(request, env, ctx) {
        try {
            const value = await env.NAMESPACE.list();

            return new Response(JSON.stringify(value.keys), {
              status: 200
            });
        }
        catch (e)
        {
            return new Response(e.message, {status: 500});
        }
    },
};
```

## Reference

The following method is provided to list the keys of KV:
- [list()](#list-method)

### `list()` method

To list all the keys in your KV namespace, call the `list()` method of the [KV binding](/kv/reference/kv-bindings/) on any KV namespace you have bound to your Worker code:

```ts
NAMESPACE.list(options?)
```

#### Parameters

{{<definitions>}}

- `options` {{<type>}}{
  prefix?: string,
  limit?: string,
  cursor?: string
}{{</type>}}

  - An object with attributes `prefix` (optional), `limit` (optional), or `cursor` (optional).
    - `prefix` is a `string` that represents a prefix you can use to filter all keys.
    - `limit` is the maximum number of keys returned. The default is 1,000, which is the maximum. It is unlikely that you will want to change this default but it is included for completeness.
    - `cursor` is a `string` used for paginating responses.

{{</definitions>}}

#### Response

{{<definitions>}}

- `response` {{<type>}}Promise<{
  keys: {
    name: string, 
    expiration?: number,
    metadata?: object
  }[],
  list_complete: boolean,
  cursor: string
}>{{</type>}}
  - A `Promise` that resolves to an object containing `keys`, `list_complete`, and `cursor` attributes. 
    - `keys` is an array that contains an object for each key listed. Each object has attributes `name`, `expiration` (optional), and `metadata` (optional). If the key-value pair has an expiration set, the expiration will be present and in absolute value form (even if it was set in TTL form). If the key-value pair has non-null metadata set, the metadata will be present.
    - `list_complete` is a boolean, which will be `false` if there are more keys to fetch, even if the `keys` array is empty. 
    - `cursor` is a `string` used for paginating responses.

{{</definitions>}}



The `list()` method returns a promise which resolves with an object that looks like the following:

```json
{
  "keys": [
    {
      "name": "foo",
      "expiration": 1234,
      "metadata": { "someMetadataKey": "someMetadataValue" }
    }
  ],
  "list_complete": false,
  "cursor": "6Ck1la0VxJ0djhidm1MdX2FyD"
}
```

Changes may take up to 60 seconds (or the value set with `cacheTtl` of the `get()` or `getWithMetadata()` method) to be reflected on the application calling the method on the KV namespace.

## Guidance


### List by prefix

List all the keys starting with a particular prefix. 

For example, you may have structured your keys with a user, a user ID, and key names, separated by colons (such as `user:1:<key>`). You could get the keys for user number one by using the following code:

```js
export default {
  async fetch(request, env, ctx) {
    const value = await env.NAMESPACE.list({ prefix: "user:1:" });
    return new Response(value.keys);
  },
};
```

This will return all keys starting with the `"user:1:"` prefix.

### Ordering

Keys are always returned in lexicographically sorted order according to their UTF-8 bytes.

### Pagination

If there are more keys to fetch, the `list_complete` key will be set to `false` and a `cursor` will also be returned. In this case, you can call `list()` again with the `cursor` value to get the next batch of keys:

```js
const value = await NAMESPACE.list();
const cursor = value.cursor;
const next_value = await NAMESPACE.list({ cursor: cursor });
```

Checking for an empty array in `keys` is not sufficient to determine whether there are more keys to fetch. Instead, use `list_complete`. 

It is possible to have an empty array in `keys`, but still have more keys to fetch, because [recently expired or deleted keys](https://en.wikipedia.org/wiki/Tombstone_%28data_store%29) must be iterated through but will not be included in the returned `keys`.

When de-paginating a large result set while also providing a `prefix` argument, the `prefix` argument must be provided in all subsequent calls along with the initial arguments.

### Optimizing storage with metadata for `list()` operations

Consider storing your values in metadata if your values fit in the [metadata-size limit](/kv/platform/limits/). Storing values in metadata is more efficient than a `list()` followed by a `get()` per key. When using `put()`, leave the `value` parameter empty and instead include a property in the metadata object:

```js
await NAMESPACE.put(key, "", {
  metadata: { value: value },
});
```

## Other methods to access KV

You can also [list keys on the command line with Wrangler](/kv/reference/kv-commands/#list) or [via the API](/api/operations/workers-kv-namespace-list-a-namespace'-s-keys).