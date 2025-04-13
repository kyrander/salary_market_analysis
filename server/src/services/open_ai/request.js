import OpenAI from "openai";

export async function aiRequest(occupation, data) {
    // Use provided API key for OpenAI
    const apiKey = global.OPENAI_API_KEY;

    // Check if API key is provided
    if (!apiKey) {
        throw new Error('OpenAI API key is not set. Please restart the server and provide a valid API key.');
    }

    const openai = new OpenAI({
        apiKey: apiKey,
    });

    let prompt = `Koosta lihtsas keeles kokkuvõte ${occupation} palgatrendist, kasutades järgmisi andmeid:
        Palgad (EUR kuus): ${data}.
        NB! KONTROLLI ANDMETE OLEMASOLU:
        - Kui andmed on tühjad ({} või pole andmeid), siis kuva teade: "Andmed puuduvad. Palgatrendi pole võimalik analüüsida."
        - Kui olemas on ainult ühe aasta andmed, siis kuva teade: "Ainult ühe aasta andmed on saadaval. Trendi analüüsimiseks on vaja vähemalt kahe aasta andmeid."
        - Kui olemas on ainult kahe aasta andmed, siis märgi, et prognoos on väga ligikaudne.
        Kui andmeid on piisavalt, siis kokkuvõte peab:
        - Selgitama palgatrendi, kas palk on tõusvas või langevas suunas ja lisana kuvades palgad formaadis: <aasta>: <palk> EUR kuus, iga aasta KINDLASTI eraldi real.
        - Andma summalist prognoosi palgatrendile järgmiseks aastateks kasutades olemas olevate aastate palgaandmeid: 2025, 2026, 2027.
        - Pakkuma soovitusi, kuidas ${occupation} saaks oma palka tõsta — näiteks soovitatavad oskused, tehnoloogiad, sertifikaadid (kui tundub ametile asjakohane) või muud arenguvõimalused.
        - Vorminda kogu väljund ülitihedas HTML-vormingus, ilma ühegi tühja reata.
        - Alapealkirjad kasuta <strong style="font-size: 1.1em; display: block; margin-top: 4px; margin-bottom: 2px;"> elemendina, et tagada, et iga pealkiri oleks omaette real.
        - Lisa palgainfo iga aasta eraldi rea peal. Ära pane erinevaid aastaid samale reale!
        - Soovitused ilma reavahetusteta.
        - Ära kasuta CSS margin ega padding atribuute, mis tekitavad lisaruumi.
        - Kuva kogu info kompaktses plokis.
        - Ära kasuta <p> tage ega <ul>/<ol> loendeid, mis tekitavad lisaruumi.
        - Ära lisa vastusesse ühtegi markdown- või koodibloki sümbolit.
    `;
    // console.log(prompt);

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 1,
            n: 1,
            messages: [
                { role: "user", content: prompt },
            ],
        });

        // console.log("OpenAI response:", response.choices[0].message.content);
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error with OpenAI API request:", error.message);
    }
}
