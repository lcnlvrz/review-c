import "./styles.css"

import { GoogleLoginBtn, Logo, PublicLayout } from "ui"

function IndexOptions() {
  return (
    <PublicLayout title="Review C Marker">
      <button onClick={() => {}}>Login</button>
      {/* <GoogleLoginBtn
        onConsent={(token) => {
          console.log("token", token)
        }}
      /> */}
    </PublicLayout>
  )
}

export default IndexOptions
