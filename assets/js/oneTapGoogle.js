function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
};

function handleUserInformation(credential) {
    if (!credential) return

    const googleResult = parseJwt(credential)

    if (!googleResult) throw new Error('Cannot fetch user information from Google')

    const img = document.querySelector('#avatar')
    img.style = "display: block; border-radius:50%; margin-left: 30px; width: 47px, height: 47px"
    img.src = googleResult.picture
    img.alt = 'User'

    document.querySelector('#given-name').innerText = `${googleResult?.given_name}`
    document.querySelector('#family-name').innerText = `${googleResult?.family_name}`
    document.querySelector('#email').innerText = `${googleResult?.email}`
    document.querySelector('#email-verified').innerText = `${googleResult?.email_verified}`
    document.querySelector('#picture').innerText = `${googleResult?.picture}`


    hideLogOutButton(false)
}

function handleCredentialResponse(response) {
    const credential = response?.credential
    localStorage.setItem('G_ID', credential);
    handleUserInformation(credential)
}

window.addEventListener("load", function () {
    const credential = localStorage.getItem('G_ID');
    if (!credential) {
        google.accounts.id.initialize({
            client_id: "301144642014-tf1qtggqb15f5hr6bj6rv1ahll1vja65.apps.googleusercontent.com",
            callback: handleCredentialResponse,
        });

        google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                document.cookie = `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
                google.accounts.id.prompt()
            }
        });
    } else {
        handleUserInformation(credential)
    }
})

function logOut() {
    localStorage.clear()
    location.reload()
}

function hideLogOutButton(boolean) {
    document.querySelector('#log-out').style = boolean ? "display:none" : "display:block"
}