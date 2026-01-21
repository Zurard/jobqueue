// console.log("what the hell is this ") // to check if the file is getting loaded

type user = {
    email: string,
    password: string
}

const addEmailToQueue = async ( email: string, subject: string) => {
    // need to add the email to the queue
}

const processEmailQueue = async () => {
    // Process the email queue
}

const Login = async ( user : user) => {
    const email = user.email
    const password = user.password
    console.log(`email:  ${email}`);
    console.log(`password: ${password}`);
    
    // Add email to queue
    await addEmailToQueue(email, "Welcome to our service!");
} 

Login({
    email: 'shreetejmeshram07@gmail.com',
    password: 'password123'
})

