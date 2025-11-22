export function jxc(...x: (string | false | null | undefined)[]) {
    return x.filter(Boolean).join(" ");
}
