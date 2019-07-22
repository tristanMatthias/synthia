export const mix = (klass: any, mixins: ((c: any) => void)[]) => {
  let returning = klass;
  mixins.forEach(mixin => returning = mixin(returning));
  return returning;
}
