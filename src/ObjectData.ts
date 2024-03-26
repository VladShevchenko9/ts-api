export class ObjectData {
    private _currentObject: Record<string, any> = {};

    public get currentObject(): Record<string, any> {
        return this._currentObject;
    };

    public addObjectProperty(key: string, value: any): Record<string, string> | string {
        const keySplit = key.split('.');
        console.log(keySplit);

        for (let i = 0; i < objData.currentObject.length; i++) {
            console.log('111');

            if(objData.currentObject.hasOwnProperty(keySplit[i])){
                console.log('222');
                return objData.currentObject[keySplit[i]] = value;
            }
        }

        return objData._currentObject[key] = value;
    };

};

const objData = new ObjectData();

objData.addObjectProperty('age', {});
objData.addObjectProperty('age.old', 12);

console.log(objData.currentObject);

// const data = {
//     user: {
//         child: {
//             name: 'Stas',
//         }
//     }
// }

// const tmp = data.user.child as Record<string, any>
// tmp.age = 12

// console.log(data);

// const keySplit = key.split('.');
// let obj = objData.currentObject;
// console.log(obj);
// console.log(keySplit);

// for (let i = 0; i < obj.length; i++) {
//     if (obj.hasOwnProperty(keySplit[i])) {
    

//         return;
//     }
// }