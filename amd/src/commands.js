// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Commands helper for the Moodle tiny_fontcase plugin.
 *
 * @module      tiny_fontcase/commands
 * @copyright   2024 Your Name <you@example.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {get_string as getString} from 'core/str';
import {
    component,
    uppercaseButtonName,
    changecaseMenuItemName,
    icon,
} from './common';

/**
 * Handle the action for your plugin.
 * @param {TinyMCE.editor} editor The tinyMCE editor instance.
 * @param {string} toCase Change font case to.
 */
const changeCase = (editor, toCase) => {
    // TODO: This would change the case of the html tags as well.
    // But the TinyMCE editor should correct that automatically.
    let selectedText = editor.selection.getContent();

    switch (toCase) {
        case 'uppercase':
            selectedText = selectedText.toUpperCase();
            editor.selection.setContent(selectedText);
        break;
        case 'lowercase':
            selectedText = selectedText.toLowerCase();
            editor.selection.setContent(selectedText);
        break;
    }
};

/**
 * Get the setup function for the buttons.
 *
 * This is performed in an async function which ultimately returns the registration function as the
 * Tiny.AddOnManager.Add() function does not support async functions.
 *
 * @returns {function} The registration function to call within the Plugin.add function.
 */
export const getSetup = async() => {
    const [
        uppercaseButtonNameTitle,
        changecaseMenuItemNameTitle,
        uppercaseTitle,
        lowercaseTitle,
        buttonImage,
    ] = await Promise.all([
        getString('button_uppercase', component),
        getString('menuitem_changecase', component),
        getString('uppercase', component),
        getString('lowercase', component),
        getButtonImage('icon', component),
    ]);

    return (editor) => {
        // Register the Moodle SVG as an icon suitable for use as a TinyMCE toolbar button.
        editor.ui.registry.addIcon(icon, buttonImage.html);

        // Register the uppercase Toolbar Button.
        editor.ui.registry.addButton(uppercaseButtonName, {
            icon,
            tooltip: uppercaseButtonNameTitle,
            onAction: () => changeCase(editor, 'uppercase'),
        });

        // Add the changecase Menu Item.
        // This allows it to be added to a standard menu, or a context menu.
        editor.ui.registry.addNestedMenuItem(changecaseMenuItemName, {
            icon,
            text: changecaseMenuItemNameTitle,
            getSubmenuItems: () => [
                {
                    type: 'menuitem',
                    text: lowercaseTitle,
                    onAction: () => changeCase(editor, 'lowercase'),
                },
                {
                    type: 'menuitem',
                    text: uppercaseTitle,
                    onAction: () => changeCase(editor, 'uppercase'),
                }
            ]
        });
    };
};
