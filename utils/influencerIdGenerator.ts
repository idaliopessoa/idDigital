/**
 * Generates a unique Influencer ID by processing the user's CPF and the current timestamp.
 * This creates a non-obvious, calculated ID in the format XXXX-XX.
 * @param cpf The user's CPF string (can be formatted or not).
 * @returns A formatted Influencer ID string.
 */
export const generateInfluencerId = (cpf: string): string => {
    // 1. Clean CPF to ensure only digits are used, and pad to a standard length.
    const cleanedCpf = (cpf || '').replace(/\D/g, '').padStart(11, '0');

    // 2. Get the current timestamp.
    const timestamp = Date.now();

    // 3. Use parts of the CPF and timestamp as seeds for the calculation.
    // Using different parts of the strings makes the result less predictable.
    const cpfSeed = parseInt(cleanedCpf.substring(3, 9), 10); // Use middle 6 digits of CPF
    const timeSeed = parseInt(timestamp.toString().slice(-6), 10); // Use last 6 digits of timestamp

    // 4. Combine the seeds using a simple algorithm and a prime multiplier to mix the values.
    const combinedValue = (cpfSeed + timeSeed) * 31;

    // 5. Use modulo to constrain the result to a 6-digit number (from 100,000 to 999,999).
    // This ensures a consistent length and avoids small numbers.
    const sixDigitNumber = (combinedValue % 900000) + 100000;

    // 6. Format the 6-digit number into the required "XXXX-XX" format.
    const idString = sixDigitNumber.toString();
    const influencerId = `${idString.substring(0, 4)}-${idString.substring(4, 6)}`;

    console.log(`IDGEN: Generated new Influencer ID: ${influencerId} from CPF and timestamp.`);

    return influencerId;
};
