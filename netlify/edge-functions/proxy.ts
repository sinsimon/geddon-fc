export default async (request, context) => {
    const url = 'https://whatsmytable.com/Paupergeddon/jsonFiles/event.json?v=1732367417784';

    try {
        // Effettua la richiesta al server di destinazione
        const response = await fetch(url);

        // Inoltra la risposta originale, aggiungendo le intestazioni per CORS e cache
        return new Response(await response.text(), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Consenti richieste da qualsiasi origine
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', // Metodi consentiti
                'Cache-Control': 'public, max-age=120', // Cache di 2 minuti
            },
        });
    } catch (error) {
        console.error('Errore durante il fetch:', error);
        return new Response('Errore interno del server', { status: 500 });
    }
};
