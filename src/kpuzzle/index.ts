import "regenerator-runtime/runtime"; // Prevent `regeneratorRuntime is not defined` error. https://github.com/babel/babel/issues/5085

export { KPuzzleDefinition, Transformation } from "./definition_types";

export { KPuzzle, stateForBlockMove } from "./kpuzzle";

export {
  Canonicalize,
  SearchSequence,
  CanonicalSequenceIterator,
} from "./canonicalize";

export {
  Combine,
  Multiply,
  IdentityTransformation,
  Invert,
  EquivalentTransformations,
  EquivalentStates,
  Order,
} from "./transformations";

export { Puzzles } from "./puzzle_definitions";

export { parse } from "./parser";

export { SVG } from "./svg";
