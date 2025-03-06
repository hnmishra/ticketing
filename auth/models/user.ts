import mongoose from 'mongoose';
import { Password } from '../src/services/password';

// An interface that describes the properties
// that are required to create a new User
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    // createAt:string
    // updatedAt:string
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,  //specific to mongose not typescript. String is a constructor function
            required: true,
        },
        password: {
            type: String,
            required: true,
        }
    },
    {
        toJSON: {
            transform(doc:any, ret:any)  {
                ret.id = ret._id;
                delete ret._id;
                delete ret.password;
                delete ret.__v;
                }
            }
        }  

    );

userSchema.pre('save', async function(done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };

//  const user = User.build({
//     email: 'hnmishra',
//     password: 'password',
//  });
