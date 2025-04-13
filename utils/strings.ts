import type { LabelSplitterType } from '~/types/DatatableClientType'
import { twMerge, type ClassNameValue } from 'tailwind-merge'
import { normalizeClass } from 'vue'
export const clean_xss = (str: string) => {
  if (typeof str === 'undefined' || str === null) return ''
  if (typeof str !== 'string') return str
  var new_data = str.replace(/<[^>]*>/g, '')
  return new_data
}

export const randomId = () => {
  return btoa(Math.random().toString())
}

export const splitLabelComplex = (
  data: Record<string, any>,
  label: string
): string => {
  const splitters: LabelSplitterType[] = ['|', ',', ' ', '-', '.', '/', '_']
  let currentLabel = label

  for (const splitter of splitters) {
    if (currentLabel.includes(splitter)) {
      const keys = currentLabel.split(splitter)
      const values = keys.map((key) => data[key] ?? key)
      return values.join(splitter)
    }
  }

  return data[label] ?? label
}

export const referenceOptions = (
  data: Record<string, any>,
  value: any,
  refLabel: string,
  refKey: string
) => {
  let display = value
  let refOptions = data as Record<string, any>

  let refSelected = refOptions.find((option: any) => option[refKey] == value)

  if (!refSelected) return value
  display = splitLabelComplex(refSelected, refLabel)

  return display
}

export const classMerge = (...classes: ClassNameValue[]) => {
  return twMerge(normalizeClass(classes))
}

export const capitalizeEachWord = (str: string) => {
  return str
    .split(' ')
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}

export const shortenBytes = (n: number) => {
  // const k = n > 0 ? Math.floor((Math.log2(n) / 10)) : 0;
  // const rank = (k > 0 ? 'KMGT'[k - 1] : '') + 'b';
  // const count = Math.floor(n / Math.pow(1024, k));
  // return count + rank;

  var marker = 1024; // Change to 1000 if required
  var decimal = 3; // Change as required
  var kiloBytes = marker; // One Kilobyte is 1024 bytes
  var megaBytes = marker * marker; // One MB is 1024 KB
  var gigaBytes = marker * marker * marker; // One GB is 1024 MB

  // return bytes if less than a KB
  if (n < kiloBytes) return n + " Bytes";
  // return KB if less than a MB
  else if (n < megaBytes) return (n / kiloBytes).toFixed(decimal) + " KB";
  // return MB if less than a GB
  else if (n < gigaBytes) return (n / megaBytes).toFixed(decimal) + " MB";
  // return GB if less than a TB
  else return (n / gigaBytes).toFixed(decimal) + " GB";
}
