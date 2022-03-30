import { JsonSchema } from "@jsonforms/core"

export interface Config {
    config: [],
    id: string,
    name: string,
    type: {
      type: string,
      config: any,
      signature: JsonSchema,
      _cls: Object
    }
}
