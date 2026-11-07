/** Join class names, skipping falsy ones: cx('a', on && 'b') */
export const cx = (...names: (string | false | null | undefined)[]) =>
  names.filter(Boolean).join(' ')
