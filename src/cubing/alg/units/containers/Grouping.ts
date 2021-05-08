import { Alg, experimentalEnsureAlg, FlexibleAlgSource } from "../../Alg";
import { AlgCommon, Comparable } from "../../common";
import { IterationDirection } from "../../iteration";
import { Move, QuantumMove } from "../leaves/Move";
import { QuantumWithAmount } from "../QuantumWithAmount";
import type { LeafUnit } from "../Unit";

// This is a workaround for `jest`, which doesn't handle cycles of imports inside `cubing/alg`.
// We need to lazy-initialize the reusable quantum moves for Square-1, so we create this wrapper for it.
class Square1TupleFormatter {
  quantumU_SQ_: QuantumMove | null = null;
  quantumD_SQ_: QuantumMove | null = null;

  format(grouping: Grouping): string | null {
    this.quantumU_SQ_ ||= new QuantumMove("U_SQ_");
    this.quantumD_SQ_ ||= new QuantumMove("D_SQ_");

    const quantumAlg = grouping.experimentalAlg;
    if (quantumAlg.experimentalNumUnits() === 2) {
      const [U, D] = quantumAlg.units();
      if (
        U.as(Move)?.quantum.isIdentical(this.quantumU_SQ_) &&
        D.as(Move)?.quantum.isIdentical(this.quantumD_SQ_)
      ) {
        if (grouping.amount !== 1) {
          throw new Error(
            "Square-1 tuples cannot have an amount other than 1.",
          );
        }
        return `(${(U as Move).amount}, ${(D as Move).amount})`;
      }
    }
    return null;
  }
}
const square1TupleFormatterInstance = new Square1TupleFormatter();

export class Grouping extends AlgCommon<Grouping> {
  readonly #quantumWithAmount: QuantumWithAmount<Alg>;

  constructor(algSource: FlexibleAlgSource, amount?: number) {
    super();
    const alg = experimentalEnsureAlg(algSource);
    this.#quantumWithAmount = new QuantumWithAmount(alg, amount);
  }

  isIdentical(other: Comparable): boolean {
    const otherAsGrouping = other as Grouping;
    return (
      other.is(Grouping) &&
      this.#quantumWithAmount.isIdentical(otherAsGrouping.#quantumWithAmount)
    );
  }

  /** @deprecated */
  get experimentalAlg(): Alg {
    return this.#quantumWithAmount.quantum;
  }

  get amount(): number {
    return this.#quantumWithAmount.amount;
  }

  /** @deprecated */
  get experimentalRepetitionSuffix(): string {
    return this.#quantumWithAmount.suffix();
  }

  invert(): Grouping {
    return new Grouping(
      this.#quantumWithAmount.quantum,
      -this.#quantumWithAmount.amount,
    );
  }

  *experimentalExpand(
    iterDir: IterationDirection = IterationDirection.Forwards,
    depth?: number,
  ): Generator<LeafUnit> {
    depth ??= Infinity;
    if (depth === 0) {
      yield iterDir === IterationDirection.Forwards ? this : this.invert();
    } else {
      yield* this.#quantumWithAmount.experimentalExpand(iterDir, depth - 1);
    }
  }

  static fromString(): Grouping {
    throw new Error("unimplemented");
  }

  toString(): string {
    return (
      square1TupleFormatterInstance.format(this) ??
      `(${this.#quantumWithAmount.quantum.toString()})${this.#quantumWithAmount.suffix()}`
    );
  }

  // toJSON(): GroupingJSON {
  //   return {
  //     type: "grouping",
  //     alg: this.#quanta.quantum.toJSON(),
  //   };
  // }
}
