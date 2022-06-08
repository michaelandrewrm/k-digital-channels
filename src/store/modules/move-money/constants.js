// La transferencia no se puede realizar
export const UNSUCCESSFUL_TRANSFER = 'C503000301';

// Faltan campos obligatorios
export const MISSING_REQUIRED_FIELDS = 'C400000301';

// Sin capacidad de firma
export const WITHOUT_SIGN_CAPABILITY = 'C503000302';

// Operación ya firmada
export const OPERATION_SIGNED = 'C503000303';

// Se ha superado los limites
export const AMOUNT_OVER_LIMIT = 'C400000302';

// La transferencia ya está dada de alta como favorita
export const ALREADY_AS_FAVORITE = 'C400000303';

// Transferencia internacional
export const IS_INTERNATIONAL = 'C400000304';

// IBAN / CCC Invalido
export const INVALID_IBAN = 'C400000305';

// IBAN no corresponde con BIC
export const UNRELATED_IBAN_BIC = 'C400000306';

// La moneda tiene que ser EUR
export const MUST_BE_EURO_CURRENCY = 'C400000307';

// El teléfono de aviso tiene que ser nacional
export const MUST_BE_NATIONAL_PHONE_NUMBER = 'C400000308';

// El tipo de moneda no es válido
export const INVALID_CURRENCY_TYPE = 'C400000310';

// Transferencia internacional realizable por sepa
export const INTERNATIONAL_TRANSFER_DOABLE_AS_SEPA = 'C400000311';

// No se permiten transferencias internacionales con esta divisa
export const CURRENCY_NOT_ALLOWED = 'C400000312';

// Origen no válido
export const INVALID_ORIGIN = 'C400000314';

// Beneficiary no válido
export const INVALID_DESTINATION = 'C400000315';

// Importe no válido
export const INVALID_AMOUNT = 'C400000316';

// Importe mayor que saldo en cuenta
export const AMOUNT_OVER_BALANCE = 'C400000313';

// Fecha no válida
export const INVALID_DATE = 'C400000317';

// Tipo de frecuencia no válida.
// Sólo para transferencias programadas/periódicas
export const INVALID_FREQUENCY = 'C400000318';

// Concepto no válido
export const INVALID_CONCEPT = 'C400000319';

// Email no válido
export const INVALID_EMAIL = 'C400000320';

// Tipo de transferencia no válido
export const INVALID_TRANSFER_MODE = 'C400000321';

// Alias no válido
export const INVALID_ALIAS = 'C400000322';

// BIC no válido
export const INVALID_BIC = 'C400000323';

// Ha surgido algún error a la hora de validar la petición en RSI
export const VALIDATION_ERROR = 'C400000324';

// Operación en RSI duplicada
export const DUPLICATED_ERROR = 'C400000325';

// Parámetros operación no válidos en RSI.
export const PARAMS_ERROR = 'C400000326';
