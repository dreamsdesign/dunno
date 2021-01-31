import { useCallback, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { loadList, resetList, loadNewPage } from '../../redux/list/listActions';
import { Props, DispatchProps } from '../../redux/list/listTypes';
import { RootState } from '../../redux/rootReducer';
import ScrollContainer from 'react-indiana-drag-scroll';
import ListPoster from './ListPoster';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import { IMAGE_BASE_URL, POSTER_SIZE } from '../../config';
import { titleCase } from '../../helpers';
import {
  Container,
  Heading,
  TitleListContainer,
  InitialSpace,
  LoadMore,
} from './ListStyles';

const List: React.FC<Props> = ({
  loadList,
  resetList,
  loadNewPage,
  list: { titles, page, totalPages },
  mediaType,
  category,
  id,
}) => {
  useEffect(() => {
    loadList(category, mediaType, page, id);
  }, [category, mediaType, page, id, loadList]);

  useEffect(() => {
    return () => resetList(category, mediaType);
  }, [category, mediaType, resetList]);

  const handleLoad = useCallback(() => {
    loadNewPage(category, mediaType);
  }, [category, mediaType, loadNewPage]);

  const bottomBoundaryRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(bottomBoundaryRef, handleLoad);
  return (
    <Container>
      <Heading>{titleCase(category)}</Heading>
      <ScrollContainer vertical={false}>
        <TitleListContainer>
          <InitialSpace additionalSpace={page === totalPages && true}>
            {titles &&
              titles.map(
                (title) =>
                  title.poster_path && (
                    <ListPoster
                      posterPath={`${IMAGE_BASE_URL}${POSTER_SIZE}${title.poster_path}`}
                      id={title.id}
                      title={title.title || title.name}
                      mediaType={mediaType}
                      key={title.id}
                    />
                  )
              )}
          </InitialSpace>
          {page < totalPages && <LoadMore ref={bottomBoundaryRef}></LoadMore>}
        </TitleListContainer>
      </ScrollContainer>
    </Container>
  );
};

const mapStateToProps = (
  state: RootState,
  { category, mediaType }: DispatchProps
) => ({
  list: state.list[`${category}_${mediaType}`],
});

export default connect(mapStateToProps, { loadList, resetList, loadNewPage })(
  List
);
