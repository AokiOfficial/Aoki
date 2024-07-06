// graphql queries
// these are currently compatible with anilist graphql API
// this file will rarely need updates
const AirDateNoQuery = `{
  Page {
    media(type: ANIME, status: RELEASING, sort: POPULARITY_DESC) {
      title {
        romaji
        english
        native
      }
      episodes
      nextAiringEpisode {
        episode
        timeUntilAiring
      }
      id
      siteUrl
      coverImage {
        large
        color
      }
      studios(isMain: true) {
        edges {
          isMain
          node {
            name
            siteUrl
          }
        }
      }
    }
  }
}`;

const AirDateQuery = `query ($search: String, $status: MediaStatus) {
  Media(type: ANIME, status: $status, search: $search) {
    title {
      romaji
      english
      native
    }
    episodes
    nextAiringEpisode {
      episode
      timeUntilAiring
    }
    id
    siteUrl
    coverImage {
      large
      color
    }
    studios(isMain: true) {
      edges {
        isMain
        node {
          name
          siteUrl
        }
      }
    }
  }
}`;

const Character = `query ($search: String) {
  Character(search: $search) {
    id
    siteUrl
    name {
      full
    }
    image {
      large
    }
    description
    favourites
    media {
      nodes {
        title {
          romaji
        }
        siteUrl
      }
    }
  }
}`;

const Schedule = `query($page: Int = 0, $amount: Int = 50, $watched: [Int!]!, $episode: [Int!]!) {
  Page(page: $page, perPage: $amount) {
    pageInfo {
      currentPage
      hasNextPage
    }
    airingSchedules(notYetAired: false, mediaId_in: $watched, sort: TIME_DESC, episode_in: $episode) {
      media {
        id
        siteUrl
        format
        duration
        episodes
        title {
          romaji
        }
        coverImage {
          large
          color
        }
        externalLinks {
          site
          url
        }
        studios(isMain: true) {
          edges {
            isMain
            node {
              name
            }
          }
        }
      }
      episode
      airingAt
      timeUntilAiring
      id
    }
  }
}`;

const Seiyuu = `query ($search: String) {
  Staff(search: $search, sort: SEARCH_MATCH) {
    id
    name {
      full
      native
    }
    language
    image {
      large
    }
    description
    siteUrl
    characters(page: 1, perPage: 20, sort: ROLE) {
      nodes {
        id
        name {
          full
          native
        }
        siteUrl
      }
    }
    staffMedia(page: 1, perPage: 20, sort: POPULARITY) {
      nodes {
        title {
          romaji
          english
        }
        siteUrl
      }
    }
  }
}`;

const User = `query ($search: String) {
  User(search: $search) {
    name
    about
    avatar {
      large
      medium
    }
    bannerImage
    options {
      profileColor
    }
    siteUrl
    favourites {
      anime(perPage: 5) {
        edges {
          node {
            title {
              userPreferred
            }
            siteUrl
          }
        }
      }
      manga(perPage: 5) {
        edges {
          node {
            title {
              userPreferred
            }
            siteUrl
          }
        }
      }
      characters(perPage: 5) {
        edges {
          node {
            name {
              full
            }
            siteUrl
          }
        }
      }
      staff(perPage: 5) {
        edges {
          node {
            name {
              full
            }
            siteUrl
          }
        }
      }
      studios(perPage: 5) {
        edges {
          node {
            name
            siteUrl
          }
        }
      }
    }
  }
}`;

const Watching = `query($watched: [Int!] = [0], $page: Int!) {
  Page(page: $page) {
    pageInfo {
      currentPage
      hasNextPage
    }
    media(id_in: $watched, sort: TITLE_ROMAJI) {
      status
      siteUrl
      id
      title {
        romaji
      }
      nextAiringEpisode {
        episode
        timeUntilAiring
      }
    }
  }
}`

export {
  AirDateNoQuery,
  AirDateQuery,
  Character,
  Schedule,
  Seiyuu,
  User,
  Watching
};