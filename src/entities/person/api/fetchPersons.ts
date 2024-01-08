import { type Person } from "../model/person.ts";

async function fetchPersons(page: number, amount: number): Promise<Person[]> {
  const url = `https://randomuser.me/api/?page=${page}&results=${amount}&seed=abc&inc=name,email,picture&noinfo`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error));
    }

    const data = await response.json();
    return data.results;
  } catch (err) {
    console.error("Fetch Error: ", err);
    return [];
  }
}

export { fetchPersons };
