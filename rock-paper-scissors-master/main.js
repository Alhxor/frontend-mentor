var btnRules = document.querySelector('#js-btn-rules')
var btnClose = document.querySelector('#js-btn-rules-modal-close')
var modalRules = document.querySelector('#js-rules-modal')

btnRules.onclick = function openRulesModal(e) {
  e.preventDefault();
  modalRules.style.visibility = 'visible'
}

btnClose.onclick = function closeRulesModal(e) {
  e.preventDefault();
  modalRules.style.visibility = 'hidden'
}
