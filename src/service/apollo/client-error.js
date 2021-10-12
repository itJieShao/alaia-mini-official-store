
export default class ClientError extends Error {
  response

  request

  constructor(response, request) {
    const message = `${ClientError.extractMessage(response)}: ${JSON.stringify({
      response,
      request,
    })}`

    super(message)

    Object.setPrototypeOf(this, ClientError.prototype)

    this.response = response
    this.request = request

    // this is needed as Safari doesn't support .captureStackTrace
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, ClientError)
    }
  }

  static extractMessage(response) {
    try {
      return response.errors[0].message
    } catch (e) {
      return `GraphQL Error (Code: ${response.status})`
    }
  }
}
