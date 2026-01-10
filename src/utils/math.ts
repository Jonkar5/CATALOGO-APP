/**
 * Safely rounds a number to 2 decimal places using Number.EPSILON 
 * to handle floating point precision issues correctly.
 */
export const roundToTwo = (num: number): number => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};
