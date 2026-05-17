// Minimal reproduction of TS2615 in @regle/core since v1.18.0.
//
// To run:
//   npm install
//   npx vue-tsc --noEmit
//
// Expected: no errors (this is what happens on @regle/core 1.17.4).
// Actual on 1.18.0+ (verified up to 1.25.2): two TS2615 errors on the
// line that awaits $validate(), one for `parent` and one for `children`.

import { useRegle } from '@regle/core';
import { required } from '@regle/rules';
import { ref } from 'vue';

// A type that refers to itself. This shape is common for trees,
// categories, comment threads, org charts, etc.
type Category = {
  uuid: string;
  name: string;
  parent?: Category;
  children: Category[];
};

const form = ref<{ item: Category | null }>({ item: null });
const { r$ } = useRegle(form, { item: { uuid: { required } } });

// Awaiting $validate() forces TypeScript to fully resolve its return type.
// Since 1.18.0 that return type maps eagerly over every key of `Category`,
// so TypeScript walks into `parent` and `children` and reports TS2615.
async function run() {
  const result = await r$.$validate();
  return result;
}
void run;
