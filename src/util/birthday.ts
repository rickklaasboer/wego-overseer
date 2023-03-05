export function daysUntilNextBirthday(birthday: Date) {
    const today = new Date();

    //Set current year or the next year if you already had birthday this year
    birthday.setFullYear(today.getFullYear());
    if (today > birthday) {
        birthday.setFullYear(today.getFullYear() + 1);
    }

    //Calculate difference between days
    return Math.floor(
        (birthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );
}
