import { z } from 'zod';

const optionalCount = z.number().finite().nonnegative().int().optional();
const optionalMeasurement = z.number().finite().nonnegative().optional();

export const healthCheckInSchema = z.object({
  heartRate: optionalCount,
  bloodPressureSystolic: optionalCount,
  bloodPressureDiastolic: optionalCount,
  breathingRate: optionalCount,
  bloodGlucose: optionalMeasurement,
  bodyTemperatureC: optionalMeasurement,
  sleepHours: optionalMeasurement,
  exerciseMinutes: optionalCount,
  mood: z.enum(['good', 'okay', 'low']).optional(),
}).superRefine((values, context) => {
  const hasSystolic = values.bloodPressureSystolic !== undefined;
  const hasDiastolic = values.bloodPressureDiastolic !== undefined;

  if (hasSystolic !== hasDiastolic) {
    context.addIssue({
      code: 'custom',
      path: [hasSystolic ? 'bloodPressureDiastolic' : 'bloodPressureSystolic'],
      message: 'Enter both blood-pressure values, or leave both blank.',
    });
  }

  if (Object.values(values).every((value) => value === undefined)) {
    context.addIssue({
      code: 'custom',
      path: ['heartRate'],
      message: 'Enter at least one measurement or a mood check-in.',
    });
  }
});

export type HealthCheckInValues = z.infer<typeof healthCheckInSchema>;
export type HealthCheckInRecord = HealthCheckInValues & { recordedAt: string };

export const EMPTY_HEALTH_CHECK_IN: HealthCheckInValues = {};

export function formatCheckInValue(value: number | undefined, decimals = 0): string {
  return value === undefined ? 'Not entered' : decimals ? value.toFixed(decimals) : String(value);
}
