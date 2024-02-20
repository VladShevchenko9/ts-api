export class StringsMerger {
    public mergeOneByOne(string1: string, string2: string): string {
        let string3: string = '';

        for (let i = 0; i < string1.length; i++) {
            if (typeof string2[i] === 'undefined') {
                string3 += string1[i];
            } else {
                string3 += string1[i] + string2[i];
            }
        }

        if (string2.length > string1.length) {
            string3 += string2.slice(string1.length)
        }

        return string3;
    }
}
