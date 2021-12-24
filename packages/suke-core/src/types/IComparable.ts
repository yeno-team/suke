export interface IComparable {
    // Compares if self is greater than an object
    CompareTo(object: IComparable): boolean;
}