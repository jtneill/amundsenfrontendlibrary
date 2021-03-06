import axios, { AxiosError, AxiosResponse } from 'axios';

import { SearchAllRequest, SearchResponse, SearchResourceRequest } from '../types';

const BASE_URL = '/api/search/v0';


export function searchAll(action: SearchAllRequest) {
  const { term, options } = action;
  return axios.all([
      axios.get(`${BASE_URL}/table?query=${term}&page_index=${options.tableIndex || 0}`),
      // TODO PEOPLE - Add request for people here
    ]).then(axios.spread((tableResponse: AxiosResponse<SearchResponse>) => {
      return {
        search_term: tableResponse.data.search_term,
        tables: tableResponse.data.tables,
      }
  })).catch((error: AxiosError) => {
    // TODO - handle errors
  });
}


export function searchResource(action: SearchResourceRequest) {
  const { term, pageIndex, resource } = action;
  return axios.get(`${BASE_URL}/${resource}?query=${term}&page_index=${pageIndex}`)
    .then((response: AxiosResponse) => {
      const { data } = response;
      const ret = { searchTerm: data.search_term };
      ['tables', 'users'].forEach((key) => {
        if (data[key]) {
          ret[key] = data[key];
        }
      });
      return ret;
    }).catch((error: AxiosError) => {
      // TODO - handle errors
    });
}
