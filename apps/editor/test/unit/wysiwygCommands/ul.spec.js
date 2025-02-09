/**
 * @fileoverview test wysiwyg ul command
 * @author NHN FE Development Lab <dl_javascript@nhn.com>
 */
import $ from 'jquery';

import UL from '@/wysiwygCommands/ul';
import WwTaskManager from '@/wwTaskManager';
import WwListManager from '@/wwListManager';
import WysiwygEditor from '@/wysiwygEditor';
import EventManager from '@/eventManager';
import WwTableSelectionManager from '@/wwTableSelectionManager';

describe('UL', () => {
  let wwe, sq, container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    wwe = new WysiwygEditor(container, new EventManager());

    wwe.init();

    sq = wwe.getEditor();
    wwe.componentManager.addManager('task', WwTaskManager);
    wwe.componentManager.addManager('list', WwListManager);
    wwe.componentManager.addManager('tableSelection', WwTableSelectionManager);
    sq.focus();
  });

  // we need to wait squire input event process
  afterEach(done => {
    setTimeout(() => {
      document.body.removeChild(container);
      done();
    });
  });

  it('add UL', () => {
    const range = sq.getSelection().cloneRange();

    range.setStart(wwe.getBody().querySelectorAll('div')[0], 0);
    range.collapse(true);
    sq.setSelection(range);
    UL.exec(wwe);

    expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
    expect(wwe.getBody().querySelectorAll('li').length).toEqual(1);
  });

  it('add UL with selection', () => {
    const $body = $(sq.getBody());
    const $div1 = $('<div>hello</div>');
    const $div2 = $('<div>world</div>');
    const $div3 = $('<div>i`m</div>');
    const $div4 = $('<div>fine</div>');

    $body.append($div1);
    $body.append($div2);
    $body.append($div3);
    $body.append($div4);

    const range = sq.getSelection();

    range.setStart($div1[0], 0);
    range.setEnd($div4[0], 1);
    sq.setSelection(range);

    UL.exec(wwe);

    expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
    expect(wwe.getBody().querySelectorAll('li').length).toEqual(4);
  });

  it('add UL with selection OL within', () => {
    const $body = $(sq.getBody());
    const $div1 = $('<div>hello</div>');
    const $div2 = $('<div>world</div>');
    const $div3 = $('<div>i`m</div>');
    const $ol = $('<ul><li>fine</li></ul>');

    $body.append($div1);
    $body.append($div2);
    $body.append($div3);
    $body.append($ol);

    const range = sq.getSelection();

    range.setStart($div1[0], 0);
    range.setEnd($ol.find('li').eq(0)[0], 1);
    sq.setSelection(range);

    UL.exec(wwe);

    expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
    expect(wwe.getBody().querySelectorAll('li').length).toEqual(4);
  });

  it('add 1 UL and 1 LI with selection former OL within', () => {
    const $body = $(sq.getBody());
    const $div1 = $('<div>hello</div>');
    const $div2 = $('<div>world</div>');
    const $div3 = $('<div>i`m</div>');
    const $ol = $('<ol><li>fine</li></ol>');

    $body.append($ol);
    $body.append($div1);
    $body.append($div2);
    $body.append($div3);

    const range = sq.getSelection();

    range.setEnd($ol[0].firstChild.firstChild, 1);
    range.setStart($div3[0].firstChild, 1);
    sq.setSelection(range);

    UL.exec(wwe);

    expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
    expect(wwe.getBody().querySelectorAll('li').length).toEqual(2);
  });

  it('change OL to UL', () => {
    const $body = $(sq.getBody());
    const $ol = $('<ol><li>fine</li></ol>');

    $body.append($ol);

    const range = sq.getSelection();

    range.setStart($ol[0].firstChild.firstChild, 1);
    range.collapse(true);
    sq.setSelection(range);

    UL.exec(wwe);

    expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
    expect(wwe.getBody().querySelectorAll('li').length).toEqual(1);
  });

  it('change OL to UL with selection', () => {
    const $body = $(sq.getBody());
    const $ol = $('<ol><li>fine</li><li>thank you</li></ol>');

    $body.append($ol);

    const range = sq.getSelection();

    range.setStart($ol[0].firstChild.firstChild, 1);
    range.setEnd($ol[0].firstChild.nextSibling, 1);
    sq.setSelection(range);

    UL.exec(wwe);

    expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
    expect(wwe.getBody().querySelectorAll('li').length).toEqual(2);
  });

  it('change TASK to UL', () => {
    const $body = $(sq.getBody());
    const $ol = $('<ol><li class="task-list-item">fine</li></ol>');

    $body.append($ol);

    const range = sq.getSelection();

    range.setStart($ol[0].firstChild.firstChild, 1);
    range.collapse(true);
    sq.setSelection(range);

    UL.exec(wwe);

    expect(wwe.getBody().querySelectorAll('ol').length).toEqual(0);
    expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
    expect(wwe.getBody().querySelectorAll('li.task-list-item').length).toEqual(0);
    expect(wwe.getBody().querySelectorAll('li').length).toEqual(1);
  });

  it('change TASK to UL with selection', () => {
    const $body = $(sq.getBody());
    const $ol = $(
      '<ol><li class="task-list-item">fine</li><li class="task-list-item">thank you</li></ol>'
    );

    $body.append($ol);

    const range = sq.getSelection();

    range.setStart($ol[0].firstChild.firstChild, 1);
    range.setEnd($ol[0].firstChild.nextSibling.firstChild, 1);
    sq.setSelection(range);

    UL.exec(wwe);

    expect(wwe.getBody().querySelectorAll('ul').length).toEqual(1);
    expect(wwe.getBody().querySelectorAll('li.task-list-item').length).toEqual(0);
    expect(wwe.getBody().querySelectorAll('li').length).toEqual(2);
  });

  it('skip changing format to UL from TABLE/PRE element', () => {
    const $body = $(sq.getBody());
    const $div1 = $('<div>fine</div>');
    const $div2 = $('<div>thank you</div>');
    const $pre = $('<pre>haha</pre>');
    const $div3 = $('<div>me too</div>');

    $body.append($div1);
    $body.append($div2);
    $body.append($pre);
    $body.append($div3);

    const range = sq.getSelection();

    range.setStart($div1[0], 0);
    range.setEnd($div3[0], 1);
    sq.setSelection(range);

    UL.exec(wwe);

    expect(wwe.getBody().querySelectorAll('ul').length).toEqual(2);
    expect($(wwe.getBody()).children('pre').length).toEqual(1);
    expect(wwe.getBody().querySelectorAll('li').length).toEqual(3);
  });

  it('should restore the stored selection', () => {
    const $body = $(sq.getBody());
    const $div = $('<div>text<em>text</em>longlongtext</div>');

    $body.append($div);

    const [, , rangeContainer] = $div.get(0).childNodes;
    let range = sq.getSelection();

    range.setStart(rangeContainer, 11);
    range.setEnd(rangeContainer, 11);
    sq.setSelection(range);
    const { startContainer, endContainer, startOffset, endOffset } = range;

    UL.exec(wwe);

    range = sq.getSelection();
    expect(range.startContainer).toBe(startContainer);
    expect(range.endContainer).toBe(endContainer);
    expect(range.startOffset).toBe(startOffset);
    expect(range.endOffset).toBe(endOffset);
  });
});
