import type ActivityDefinition from "./ActivityDefinition"

declare function parse<T>(input: T): Array<ActivityDefinition>

export default parse