import React from 'react';
import { useRouter } from 'next/router';
import { Card, Flex, Image, Tag } from 'antd';

import useGetRelease from '@/hooks/useGetRelease';
import { Loader } from '@/components/Loader';

import "../../app/globals.css";

const Release = () => {
    const router = useRouter();
    const id = router.query.id as string; 

    const { release, isLoading, error } = useGetRelease(id);

    return (
        <Loader loading={isLoading}>
            {error && <div className='my-5 text-center'>{error}</div>}
            {release && <Card title={<h2 className='text-center'>{release?.title}</h2>} bordered={false} className='w-[80%] mx-auto mt-20'>
                <Flex gap='middle' vertical className='sm:flex-row'>
                    <Image src={release?.thumb} preview={false} alt={release?.title} />
                    <Flex vertical justify='space-between'>
                        <div className='mb-1'>
                            <b>Year: </b>
                            <Tag>{release?.year}</Tag>
                        </div>
                        <div className='w-[200px] mb-1'>
                            <b>Released: </b>
                            <Tag>{release?.released}</Tag>
                        </div>
                        <div className='mb-1'>
                            <b>Artists: </b>
                            <Tag>{release?.artists_sort}</Tag>
                        </div>
                        <div className='mb-1'>
                            <b>Genres: </b>
                            {release?.genres.map(item => <Tag key={item}>{item}</Tag>)}
                        </div>
                        <div className='mb-1'>This track is in <Tag>{release?.community?.have || '0'}</Tag>collections.</div>
                    </Flex>
                </Flex>
            </Card>}
        </Loader>
    );
}

export default Release;