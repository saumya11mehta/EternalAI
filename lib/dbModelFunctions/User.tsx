import User from '@/lib/db/userSchema';

export async function findUserByEmail(email: string){
    return await User.findOne({ email });
}

export async function saveUser(username:string,email:string,hashedPassword:string){
    // Create a new user document
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    // Save the new user document to the database
    await newUser.save();
    return newUser;
}