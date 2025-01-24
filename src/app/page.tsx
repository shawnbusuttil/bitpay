"use client"

import { Loader } from '@/components/Loader';
import Search from '@/components/Search';
import useGetReleasesByArtist from '@/hooks/useGetReleasesByArtist';
import { Image, Card, PaginationProps, Pagination, Flex } from 'antd';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Home = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const artistQuery = searchParams?.get('artist');
  const pageQuery = searchParams?.get('page');

  const [artist, setArtist] = useState<string | undefined>(artistQuery || undefined);
  const [currentPage, setCurrentPage] = useState<number | undefined>(
    pageQuery ? parseInt(pageQuery) : undefined
  );
  
  const { releases, isLoading, error } = useGetReleasesByArtist(artist, currentPage);

  const handleSearch = (value: string) => {
    if (!value) return;

    setArtist(value);
    setCurrentPage(undefined);

    router.push(`/?artist=${encodeURIComponent(value)}`);
  };

  const onChange: PaginationProps['onChange'] = (page) => {
    setCurrentPage(page);
    router.push(`/?artist=${encodeURIComponent(artist!)}&page=${page}`);
  };

  useEffect(() => {
    setArtist(artistQuery!);
    setCurrentPage(parseInt(pageQuery!));
  }, [artistQuery, pageQuery]);

  return (
    <div className='flex flex-col py-5 items-center min-w-[250px] text-center'>
      <h1 className='font-bold text-2xl mb-5'>Search For Your Favourite Artist</h1>
      <Search onSearch={handleSearch} />
      
      <Loader loading={isLoading}>
        <Flex vertical justify='space-between' align='center' className='m-5' gap={20}>
          <Flex vertical justify='space-between' wrap className='sm:flex-row min-h-[600px]' gap={8}>
            {error && <div>{error}</div>}
            {releases?.releases?.map(rel => (
              <Link key={rel.id} href={`/releases/${rel.id}`} className='h-[250px]'>
                <Card title={rel.title} bordered={false} className='w-[200px] h-full'>
                  <Image src={rel.thumb} preview={false} alt={rel.title} />
                </Card>
              </Link>
            ))}
          </Flex>
          {releases?.pagination?.pages && releases.pagination.pages > 1 && (
            <Pagination 
              data-testid="pagination"
              className='self-center' 
              current={currentPage} 
              onChange={onChange} 
              total={releases.pagination.pages} 
              showSizeChanger={false} 
            />
          )}
        </Flex>
      </Loader>
    </div>
  )
}

export default Home;
