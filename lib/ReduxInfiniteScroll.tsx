import PropTypes from "prop-types";
import React from "react";
import ReactDOM from "react-dom";

import { topPosition } from "./Utilities/DOMPositionUtils";

interface IPassedProps {
    className?: string;
    loadMore?: () => void;
    elementIsScrollable?: boolean;
    useBodyScroll?: boolean;
    containerHeight?: number;
    threshold: number;
    hasMore?: boolean;
    loadingMore?: boolean;
    loader: any;
    showLoader: boolean;
    items?: any[];
    children?: any[];
    holderType?: string;
}

export default class ReduxInfiniteScroll extends React.Component<IPassedProps, undefined> {
    constructor(props: IPassedProps) {
        super(props);
    }

    public componentDidMount() {
        this.attachScrollListener();
    }

    public componentDidUpdate() {
        this.attachScrollListener();
    }

    public _findElement() {
        return this.props.elementIsScrollable ? ReactDOM.findDOMNode(this) : window;
    }

    public attachScrollListener() {
        if (!this.props.hasMore || this.props.loadingMore) {
            return;
        }
        const el = this._findElement();
        el.addEventListener("scroll", this.scrollListener, true);
        el.addEventListener("resize", this.scrollListener, true);
        this.scrollListener();
    }

    public _elScrollListener() {
        const el = ReactDOM.findDOMNode(this) as HTMLElement;
        const topScrollPos = el.scrollTop;
        const totalContainerHeight = el.scrollHeight;
        const containerFixedHeight = el.offsetHeight;
        const bottomScrollPos = topScrollPos + containerFixedHeight;

        return (totalContainerHeight - bottomScrollPos);
    }

    public _windowScrollListener() {
        const el = ReactDOM.findDOMNode(this) as HTMLElement;
        const body = (document.documentElement || document.body.parentNode || document.body) as HTMLElement;
        const windowScrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset
            : body.scrollTop;
        const elTotalHeight = topPosition(el) + el.offsetHeight;
        const currentBottomPosition = elTotalHeight - windowScrollTop - window.innerHeight;

        return currentBottomPosition;
    }

    public scrollListener = () => {
        // This is to prevent the upcoming logic from toggling a load more before
        // any data has been passed to the component
        if (this._totalItemsSize() <= 0) {
            return;
        }

        const bottomPosition = this.props.elementIsScrollable ? this._elScrollListener() : this._windowScrollListener();

        if (bottomPosition < Number(this.props.threshold)) {
            this.detachScrollListener();
            this.props.loadMore();
        }
    }

    public detachScrollListener() {
        const el = this._findElement();
        el.removeEventListener("scroll", this.scrollListener, true);
        el.removeEventListener("resize", this.scrollListener, true);
    }

    public _renderOptions() {
        const allItems = this.props.children.concat(this.props.items);

        return allItems;
    }

    public _totalItemsSize() {
        return this.props.children.length + (this.props.items && this.props.items.length);
    }

    public componentWillUnmount() {
        this.detachScrollListener();
    }

    public renderLoader() {
        return (this.props.loadingMore && this.props.showLoader) ? this.props.loader : undefined;
    }

    public _assignHolderClass() {
        const additionalClass = (typeof this.props.className === "function") ? this.props.className() : this.props.className;
        return "redux-infinite-scroll " + additionalClass;
    }

    public render() {
        const Holder = this.props.holderType || "div";
        return (
            <Holder
                className={this._assignHolderClass()}
                style={{ height: this.props.containerHeight }}
            >
                {this._renderOptions()}
                {this.renderLoader()}
            </Holder>
        );
    }
}
