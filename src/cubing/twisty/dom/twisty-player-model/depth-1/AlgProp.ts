import { Alg } from "../../../../alg";
import { TwistyPropSource } from "../TwistyProp";

export class AlgIssues {
  // TODO: (string | Error)[]

  readonly warnings: string[];
  readonly errors: string[];

  constructor(issues?: { warnings?: string[]; errors?: string[] }) {
    Object.freeze(issues?.warnings ?? []);
    Object.freeze(issues?.errors ?? []);
    Object.freeze(this);
  }

  /** @deprecated */
  log() {
    if (this.errors.length > 0) {
      console.error(`🚨 ${this.errors[0]}`);
    } else if (this.warnings.length > 0) {
      console.warn(`⚠️ ${this.warnings[0]}`);
    } else {
      console.info("😎 No issues!");
    }
  }
}

export interface AlgWithIssues {
  alg: Alg;
  issues: AlgIssues;
}
export class AlgProp extends TwistyPropSource<AlgWithIssues, Alg | String> {
  async getDefaultValue(): Promise<AlgWithIssues> {
    return { alg: new Alg(), issues: new AlgIssues() };
  }

  async derive(newAlg: Alg | string): Promise<AlgWithIssues> {
    if (typeof newAlg === "string") {
      console.log("fromstring!");
      try {
        const alg = Alg.fromString(newAlg); // TODO: is this safe?
        const warnings = [];
        if (alg.toString() !== newAlg) {
          // TODO: Push this check into the parser and return semantic info (so they can be e.g. highlighted).
          warnings.push(`Alg is non-canonical!`);
        }
        return {
          alg,
          issues: new AlgIssues({ warnings }),
        };
      } catch (e) {
        return {
          alg: new Alg(),
          issues: new AlgIssues({ errors: [`Malformed alg: ${e}`] }),
        };
      }
    } else {
      return {
        alg: newAlg,
        issues: new AlgIssues(),
      };
    }
  }
}
