'use strict';
const chai = require('chai');
const sinon = require('sinon');
const fileSystem = require('../../file-system');

// ストレージとしてfile-systemの実装が使われるようにする
process.env.npm_lifecycle_event = 'file-system';
const app = require('../../app');

// Sinon.JSのアサーションAPIをChaiのアサーションAPIを介して利用できるようにする
const assert = chai.assert;
sinon.assert.expose(assert, { prefix: '' });

// Chai HTTPプラグインの利用
chai.use(require('chai-http'));

// 毎回のテスト実行後にSinon.JSによる副作用を元に戻す
afterEach(() => sinon.restore());

describe('app', () => {
  describe('Get /api/todos', () => {
    describe('completedが指定されていない場合', () => {
      it('fetchAll()で取得したToDoの配列を返す', async () => {
        const todos = [
          { id: 'a', title: 'ネーム', completed: false },
          { id: 'b', title: '下書き', completed: true },
        ];

        // スタブの生成
        sinon.stub(fileSystem, 'fetchAll').resolves(todos);

        // リクエストの送信
        const res = await chai.request(app).get('/api/todos');

        // レスポンスのアサーション
        assert.strictEqual(res.status, 200);
        assert.deepEqual(res.body, todos);
      });

      it('fetchAll()が失敗したらエラーを返す', async () => {
        // スタブの生成
        sinon.stub(fileSystem, 'fetchAll').rejects(new Error('fetchAll失敗'));

        // リクエストの送信
        const res = await chai.request(app).get('/api/todos');

        // レスポンスのアサーション
        assert.strictEqual(res.status, 500);
        assert.deepEqual(res.body, { error: 'fetchAll失敗' });
      });
    });
    describe('completedが指定されている場合', () => {
      it('completedを引数にfetchByCompleted()を実行したToDoの配列を返す', async () => {
        const todos = [
          { id: 'a', title: 'ネーム', completed: false },
          { id: 'b', title: '下書き', completed: true },
        ];

        // スタブの生成
        sinon.stub(fileSystem, 'fetchByCompleted').resolves(todos);

        for (const completed of [true, false]) {
          // リクエストの送信
          const res = await chai
            .request(app)
            .get('/api/todos')
            .query({ completed });

          // レスポンスのアサーション
          assert.strictEqual(res.status, 200);
          assert.deepEqual(res.body, todos);

          // fetchByCompleted()の引数のアサーション
          assert.calledWith(fileSystem.fetchByCompleted, completed);
        }
      });

      it('fetchByCompletedが失敗したらエラーを返す', async () => {
        // スタブの生成
        sinon
          .stub(fileSystem, 'fetchByCompleted')
          .rejects(new Error('fetchByCompleted()失敗'));

        // リクエストの送信
        const res = await chai
          .request(app)
          .get('/api/todos')
          .query({ completed: true });

        // レスポンスのアサーション
        assert.strictEqual(res.status, 500);
        assert.deepEqual(res.body, { error: 'fetchByCompleted()失敗' });
      });
    });

    describe('POST /api/todos', () => {
      it('パラメータで指定したタイトルを引数にcreateを実行し、結果を返す', async () => {
        // スタブの生成
        sinon.stub(fileSystem, 'create').resolves();

        // リクエストの送信
        const res = await chai.request(app).post('/api/todos').send({
          title: 'ネーム',
        });

        // レスポンスのアサーション
        assert.strictEqual(res.status, 201);
        assert.strictEqual(res.body.title, 'ネーム');
        assert.strictEqual(res.body.completed, false);
        // create()の引数のアサーション
        assert.calledWith(fileSystem.create, res.body);
      });

      it('パラメータにタイトルが指定されていない場合、404エラーを返す', async () => {
        // スパイの生成(実行されないはずなのでスタブである必要がない)
        sinon.spy(fileSystem, 'create');

        for (const title of ['', undefined]) {
          // リクエストの送信
          const res = await chai
            .request(app)
            .post('/api/todos')
            .send({ title });

          // レスポンスのアサーション
          assert.strictEqual(res.status, 400);
          assert.deepEqual(res.body, { error: 'title is required' });
          // create()が実行されていないことのアサーション
          assert.notCalled(fileSystem.create);
        }
      });

      it('create()が失敗したらエラーを返す', async () => {
        // スタブの生成
        sinon.stub(fileSystem, 'create').rejects(new Error('create()失敗'));

        // リクエストの送信
        const res = await chai.request(app).post('/api/todos').send({
          title: 'ネーム',
        });

        // // レスポンスのアサーション
        assert.strictEqual(res.status, 500);
        assert.deepEqual(res.body, { error: 'create()失敗' });
      });
    });
  });
});
