/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ListView,
    Alert
} from 'react-native';

const ds = new ListView.DataSource({
    rowHasChanged: (r1, r2) => r1 !== r2
});

export default class reactNativeApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentPage: 0,
            total: 0,
            data: []
        }
        this.reachedEnd = this.reachedEnd.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
    }

    render() {
        let {data, total} = this.state;
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={ds.cloneWithRows(this.state.data)}
                    renderRow={(rowData) => (
                        <View style={styles.item}>
                            <Text>{rowData.key}</Text>
                        </View>
                    )}
                    onEndReached={this.reachedEnd}
                    onEndReachedThreshold={10}
                    renderFooter={this.renderFooter}
                />

            </View>
        );
    }

    componentDidMount() {
        this.loadData();
    }

    requestData(page) {
        // 这里的 IP 改成你的本地 IP
        return fetch('http://172.22.154.23:3333/list?page=' + page)
            .then(res => res.json())
            .then(resJSON => {
                if (resJSON.code !== 0) {
                    throw '请求失败';
                } else {
                    return resJSON;
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    loadData() {
        (async () => {
            this.setState({
                loading: true
            });
            let {currentPage} = this.state;
            let {data} = await this.requestData(currentPage + 1);
            console.log('data', data);
            this.setState({
                loading: false,
                currentPage: data.currentPage,
                total: data.total,
                data: this.state.data.concat(data.data)
            })

        })()
    }

    reachedEnd() {
        let {loading, data, total} = this.state;
        if (!loading && total && data.length !== total) {
            this.loadData();
        }
    }

    renderFooter() {
        let {total, data} = this.state;
        if (total && total === data.length) {
            return (
                <View style={styles.bottomBoundary}>
                    <Text>------ 我是有底线的 -----</Text>
                </View>
            )
        } else {
            return null;
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    item: {
        height: 100,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#666'
    },
    bottomBoundary: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center'
    }
});

AppRegistry.registerComponent('reactNativeApp', () => reactNativeApp);
