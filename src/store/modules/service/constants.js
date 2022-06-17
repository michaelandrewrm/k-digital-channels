// La sesión ha expirado y necesita una nueva clave par.
export const UUID_EXPIRED = 'C401000101';

// Error genérico de credenciales inválidas. No cuenta como intento.
export const USER_INVALID_CRED = 'C4010000';

// Usuario y/o contraseña incorrectos. Cuenta como intento.
export const USER_NOT_FOUND = 'C401000201';

// El usuario será temporalmente bloqueado.
export const USER_WILL_BE_TEMP_BLOCKED = 'C401000202';

// El usuario ha sido temporalmente bloqueado.
export const USER_WAS_TEMP_BLOCKED = 'C401000203';

// El usuario será bloqueado.
export const USER_WILL_BE_PERMANENTLY_BLOCKED = 'C401000204';

// El usuario ha sido bloqueado.
export const USER_WAS_PERMANENTLY_BLOCKED = 'C401000205';

// El token de usuario recordado no es válido o lo era pero ha caducado.
export const INVALID_REMEMBER_TOKEN = 'C401000207';

// La petición no es válida porque requiere subida de nivel se la sesión.
export const SCA_REQUIRED = 'C403000003';

// Se requiere una clave única para poder continuar.
// La clave única se ha enviado al teléfono del cliente.
export const OTP_REQUIRED = 'C403000001';

// La clave única enviada no es válida.
export const OTP_INVALID = 'C403000101';

// El usuario ha pedido una nueva clave única
export const OTP_RENEWED = 'C403000103';

// La clave única enviada ha expirado (expira en dos minutos).
export const OTP_EXPIRED = 'C403000102';

// Error al validar la clave única. Este código suele salir al tercer intento.
// Probablemente el usuario ha sido bloqueado.
export const OTP_ERROR = 'C403000002';

// El servidor no ha respondido en el tiempo establecido.
export const REQUEST_TIMEOUT = 'ECONNABORTED';

// Beneficiario (de envio) no encontrado. El teléfono no está registrado en bizum.
export const BIZUM_DESTINATION_NOT_FOUND = 'C400000004';

// Beneficiario (de solicitud) no encontrado. El teléfono no está registrado en bizum.
export const BIZUM_ISSUER_NOT_FOUND = 'C400000005';

// Beneficiario no encontrado y con una solicitud de invitación pendiente.
export const BIZUM_DESTINATION_IS_PENDING = 'C400000012';

// Importe superior al límite máximo.
export const BIZUM_MAX_LIMIT = 'C400000006';

// Importe inferior al límite mínimo.
export const BIZUM_MIN_LIMIT = 'C400000007';

// Se ha superado el importe máximo por día.
export const BIZUM_DAILY_AMOUNT_LIMIT = 'C400000008';

// Se ha superado el número de operaciones máximas por día.
export const BIZUM_DAILY_LIMIT = 'C400000009';

// Se ha superado el número de operaciones máximas de envíos al mes.
export const BIZUM_SEND_MONTHLY_LIMIT = 'C400000010';

// Se ha superado el número de operaciones máximas de solicitudes al mes.
export const BIZUM_REQUEST_MONTHLY_LIMIT = 'C400000013';

// Se ha superado el tiempo límite para confirmar la operación.
export const BIZUM_TIMEOUT = 'C408000001';

// Se ha superado el saldo disponible en la cuenta para realizar la operación.
export const BIZUM_BALANCE_LIMIT = 'C400000011';

// Se ha superado el número de intentos máximos para la portabilidad
export const BIZUM_OTP_ERROR = 'C403000104';

// El teléfono destino es el mismo que el teléfono emisor.
export const BIZUM_DESTINATION_PHONE_NOT_VALID = 'C412000003';

// El teléfono del usuario ya se encuentra registrado en bizum.
export const BIZUM_PHONE_ALREADY_EXISTS = 'C412000001';

// El email del usuario ya se encuentra registrado en bizum.
export const BIZUM_EMAIL_ALREADY_EXISTS = 'C412000002';

// No se ha podido incluir el texto y/o imagen a la operación.
export const BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE1 = 'C200000000';
export const BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE2 = 'C200000001';
export const BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE3 = 'C200000002';
export const BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE4 = 'C200000003';
export const BIZUM_ERROR_ADDITIONAL_CONTENT_TYPE5 = 'C200000004';

// La operativa on está disponible
export const BIZUM_ERROR_OPERATIVE_NOT_AVAILABLE = 'C500000011';

// El usuario no está bloqueado por número de intentos fallidos
export const USER_NOT_PERMANENTLY_BLOCKED = 'C400000204';
