import { FilterFn } from '@tanstack/react-table'

export const dateBetweenFilterFn: FilterFn<any> = (row, columnId, value) => {
  let date = row.getValue(columnId)
  if (typeof date === 'string') {
    const [day, month, year] = date.split('/')
    date = new Date(Number(year), Number(month) - 1, Number(day))
  }

  if (!(date instanceof Date)) {
    console.error(
      `Value of column "${columnId}" is expected to be a date, but got ${date}`
    )
    return false
  }

  const { from, to } = value ?? {} // value => two date input values
  if (
    !(from instanceof Date || from === undefined) ||
    !(to instanceof Date || to === undefined)
  ) {
    console.error(
      `Filter value of column "${columnId}" is expected to be an array of two dates, but got ${value}`
    )
    return false
  }

  // If one filter defined and date is undefined, filter it
  if ((from || to) && !date) {
    return false
  }

  if (from && !to) {
    return date.getTime() >= from.getTime()
  } else if (!from && to) {
    return date.getTime() <= to.getTime()
  } else if (from && to) {
    return date.getTime() >= from.getTime() && date.getTime() <= to.getTime()
  }

  return true
}

dateBetweenFilterFn.autoRemove

export const statusFilterFn: FilterFn<any> = (row, columnId, value) => {
  const status = row.getValue(columnId)
  return status === value
}
