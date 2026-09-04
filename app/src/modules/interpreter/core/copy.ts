import { RuntimeValue, mkArray, mkRecord } from './values';
import { PseudocodeArray } from './arrays';
import { RecordValue } from './records';

/**
 * Pseudocode assignment has value semantics for arrays and records
 * (e.g. `Pupil2 ← Pupil1`, `SavedGame ← NoughtsAndCrosses` copy the data).
 * Objects and pointers remain references; scalars are immutable.
 */
export function copyValue(v: RuntimeValue): RuntimeValue {
  if (v.type === 'ARRAY') return mkArray((v.value as PseudocodeArray).clone(copyValue));
  if (v.type === 'RECORD') return mkRecord((v.value as RecordValue).clone(copyValue));
  return v;
}
