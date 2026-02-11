import React from "react"

const ErrorMessage = ({ error = "" }: { error: string }) => {

  return error && <p className="text-red-500 mt-2 mb-5 text-small">{error.split(',').map((err, index) => <span key={index}>{err}<br /></span>)}</p>
}

export default ErrorMessage
