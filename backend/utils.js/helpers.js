const generateAlphanumericPasskey = () => {
    // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let passkey = '';
    for (let i = 0; i < 6; i++) {
        passkey += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return passkey;
};

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

module.exports = {
    generateAlphanumericPasskey,
    getRandomColor
}


