import React from 'react';
import { GetProps, Input } from 'antd';

type SearchProps = GetProps<typeof Input.Search>;

type Props = {
    onSearch: SearchProps['onSearch'];
}

const Search = ({ onSearch }: Props) => {
    return (
        <Input.Search 
            placeholder='Search for your favourite artist...' 
            onSearch={onSearch} 
            allowClear 
            className='w-[80%]'
            data-testid="search-input"
        />
    );
}

export default Search;