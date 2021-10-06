import alfy from 'alfy';
import { Client } from '@notionhq/client';


const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

const { results } = await notion.search({ query: alfy.input });

const getOutputData = (item) => {
    if (item.object === 'database') {
        // For some reason notion uses id in different format in links
        const id = item.id.replace(/-/g, '');
        const title = item.title[0].plain_text;

        return {
            title,
            baseUrl: `//www.notion.so/${process.env.NOTION_USER}/${id}`
        }
    }

    if (item.object === 'page') {
        const titleProperty = getTitleProperty(item.properties);

        const title = titleProperty?.title[0].plain_text || 'Unnamed result';

        return {
            title,
            // page has explicit url, but to open in application we need to crop it
            baseUrl: item.url.replace('https://', ''),
        }
    }

    return null;
}

const getTitleProperty = (properties) => {
    return Object.entries(properties).map(([, value]) => value).find(({ type }) => {
        return type === 'title';
    })
}


const output = results.map(item => {
    const data = getOutputData(item);

    if (!data) {
        return null;
    }

    return {
        title: data.title,
        autocomplete: data.title,
        subtitle: 'Open in Notion',
        arg: `notion:/${data.baseUrl}`,
        mods: {
            ctrl: {
                title: data.title,
                subtitle: 'Open in Browser',
                arg: `https:${data.baseUrl}`,
            }
        }

    }
}).filter(x => x)


alfy.output(output);

