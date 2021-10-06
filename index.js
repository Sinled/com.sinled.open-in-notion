import alfy from 'alfy';
import { Client } from '@notionhq/client';


const notion = new Client({
    auth: process.env.NOTION_TOKEN,
})

const { results } = await notion.search({ query: alfy.input });

const getOutputData = (item) => {
    const baseUrl = item.url.replace('https://', '')
    const emojiIcon = getEmojiIcon(item)

    if (item.object === 'database') {
        // For some reason notion uses id in different format in links
        const title = item.title[0].plain_text;

        return {
            title: `${emojiIcon} ${title}`,
            baseUrl,
        }
    }

    if (item.object === 'page') {
        const titleProperty = getTitleProperty(item.properties);

        const title = titleProperty?.title[0].plain_text || 'Unnamed result';

        return {
            title: `${emojiIcon} ${title}`,
            // page has explicit url, but to open in application we need to crop it
            baseUrl,
        }
    }

    return null;
}

const getEmojiIcon = (item) => {
    if (item.icon?.type !== 'emoji') {
        return '';
    }

    return item.icon.emoji;
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
        icon: { path: '/Applications/Notion.app', type: 'fileicon' },
        mods: {
            ctrl: {
                title: data.title,
                subtitle: 'Open in Browser',
                arg: `https:${data.baseUrl}`,
                icon: { path: '/Applications/Safari.app', type: 'fileicon' },
            }
        }

    }
}).filter(x => x)


alfy.output(output);

