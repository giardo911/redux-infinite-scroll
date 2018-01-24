import { Loading } from "common/loading";
import InfiniteScroll from "lib/redux-infinite-scroll/ReduxInfiniteScroll";
import React from "react";

interface IProps {
    items: any[];
    count: number;
    pageNo: number;
    loadingMore: boolean;
    elementIsScrollable: boolean;
    pageSize: number;
    getNext: () => void;
    mapper: (item: any) => JSX.Element;
}

const InfiniteTable = (props: IProps) => {
    const { items, mapper, count, loadingMore, pageNo, pageSize, elementIsScrollable } = props;

    const rows = items && items.map(mapper);
    const getNext = () => {
        props.getNext();
    };

    return (
        <InfiniteScroll
            className="sp-block-table__body"
            loadMore={getNext}
            loadingMore={loadingMore}
            elementIsScrollable={false}
            hasMore={(pageNo * pageSize) < count}
            showLoader={true}
            threshold={100}
            loader={
                <div className="sp-block-table__row sp-block-table__row_loader">
                    <div className="sp-block-table__loader-container">
                        <Loading />
                    </div>
                </div>
            }
        >
            {rows}
        </InfiniteScroll>
    );
};

export { InfiniteTable };
